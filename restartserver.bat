@echo off
SET API_URL="http://srv-dashboard01:3034/api/doctors"
SET RESPONSE_FILE=response.txt

REM Check if the API is reachable and save the response
curl -s %API_URL% > %RESPONSE_FILE%

REM Read the response
SET /p RESPONSE=<%RESPONSE_FILE%

REM Display the response for debugging
echo Response: %RESPONSE%

REM Check if the response contains the error message
echo %RESPONSE% | findstr /C:"Failed to fetch doctor details" >nul
IF %ERRORLEVEL% EQU 0 (
    echo API returned error. Restarting server...
    cd /d C:\askv2-initial
    
    REM Find and kill the node process
    FOR /F "tokens=2" %%a IN ('tasklist ^| findstr node.exe') DO (
        taskkill /f /pid %%a
    )

    START /B cmd /c "node server.js"
) ELSE (
    echo API is running.
)

REM Clean up
del %RESPONSE_FILE%
