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
IF %ERRORLEVEL% EQU 0 (
    echo API is running.
) ELSE (
    echo API returned error. Restarting server...
    cd /d "D:\askv2-prod"
    
    REM Find and kill the specific node process
    FOR /F "tokens=2" %%a IN ('tasklist /FI "IMAGENAME eq node.exe" /FI "WINDOWTITLE eq MyNodeServer*"') DO (
        taskkill /f /pid %%a
    )

    START "MyNodeServer" /B cmd /c "node server.js"
)

REM Clean up
del %RESPONSE_FILE%
