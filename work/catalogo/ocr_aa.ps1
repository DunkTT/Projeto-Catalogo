param([string]$Root)
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[Windows.Storage.StorageFile,Windows.Storage,ContentType=WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine,Windows.Foundation,ContentType=WindowsRuntime] | Out-Null
[Windows.Globalization.Language,Windows.Globalization,ContentType=WindowsRuntime] | Out-Null
$taskMethod = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation'+[char]96+'1' } | Select-Object -First 1
function Wait-Async($Operation,[Type]$Type) {
 $task=$taskMethod.MakeGenericMethod($Type).Invoke($null,@($Operation))
 $task.Wait()
 return $task.Result
}
$language=New-Object Windows.Globalization.Language('en-US')
$engine=[Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($language)
$results=@()
foreach($file in (Get-ChildItem -LiteralPath (Join-Path $Root 'aa') -Filter '*.jpg' | Sort-Object Name)) {
 $saved=Join-Path $Root ('aa\'+$file.BaseName+'.json')
 if(Test-Path -LiteralPath $saved){continue}
 try{
 $storage=Wait-Async ([Windows.Storage.StorageFile]::GetFileFromPathAsync($file.FullName)) ([Windows.Storage.StorageFile])
 $stream=Wait-Async ($storage.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
 $decoder=Wait-Async ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
 $bitmap=Wait-Async ($decoder.GetSoftwareBitmapAsync()) ([Windows.Graphics.Imaging.SoftwareBitmap])
 $result=Wait-Async ($engine.RecognizeAsync($bitmap)) ([Windows.Media.Ocr.OcrResult])
 $lines=@($result.Lines | ForEach-Object {
  $words=@($_.Words|ForEach-Object {@{text=$_.Text;x=$_.BoundingRect.X;y=$_.BoundingRect.Y;w=$_.BoundingRect.Width;h=$_.BoundingRect.Height}})
  @{text=$_.Text;words=$words}
 })
 @{file=$file.Name;width=$bitmap.PixelWidth;height=$bitmap.PixelHeight;text=$result.Text;lines=$lines} | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath $saved -Encoding utf8
 $bitmap.Dispose();$stream.Dispose()
 }catch{Write-Output ($file.Name+': '+$_.Exception.Message)}
}
Write-Output ('OCR files: '+@(Get-ChildItem -LiteralPath (Join-Path $Root 'aa') -Filter '*.json').Count)

