@echo off

REM Define URLs
SET API_SMS=http://srv-webapp01:3022/api/fix/run-all-fixes

REM Call the doctors API with a 10-second timeout
echo Calling doctors API...
curl -s --max-time 10 %API_SMS% > NUL
IF %ERRORLEVEL% NEQ 0 (
    echo Error occurred when calling doctors API.
) ELSE (
    echo Doctors API call completed.
)

REM End script
exit /b 0
