#!/bin/bash

# This script is executed before copying the source
rm -rf /var/www/html/*
export app_root=/home/ubuntu/webapp-UI
if [ -d "$app_root" ];then
    rm -rf /home/ubuntu/webapp-UI
    mkdir -p /home/ubuntu/webapp-UI
else
    mkdir -p /home/ubuntu/webapp-UI
fi