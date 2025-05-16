@echo off
sc stop "ask-prod"
timeout /t 5
sc start "ask-prod"
