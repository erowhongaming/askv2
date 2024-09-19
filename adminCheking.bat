@echo off

REM Define URLs
SET API_DOCTORS=http://srv-dashboard01:3034/api/check-doctors
SET API_HRCARD=http://srv-dashboard01:3034/api/check-hrcard

REM Call the doctors API with a 10-second timeout
echo Calling doctors API...
curl -s --max-time 10 %API_DOCTORS% > NUL
IF %ERRORLEVEL% NEQ 0 (
    echo Error occurred when calling doctors API.
) ELSE (
    echo Doctors API call completed.
)

REM Introduce a delay to ensure sequential execution
echo Waiting for 5 seconds before calling the next API...
timeout /t 5 /nobreak > NUL

REM Call the HR card API with a 10-second timeout
echo Calling HR card API...
curl -s --max-time 10 %API_HRCARD% > NUL
IF %ERRORLEVEL% NEQ 0 (
    echo Error occurred when calling HR card API.
) ELSE (
    echo HR card API call completed.
)

REM End script
exit /b 0
