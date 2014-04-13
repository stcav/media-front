#!/bin/bash
# STCAV_DOMAIN_ROOT MUST BE CONFIGURED AS ENVIRONMENT VARIABLE
DOMAIN_ROOT=$STCAV_DOMAIN_ROOT
# Copying all files to domain root folder
cp -r * $DOMAIN_ROOT
rm $DOMAIN_ROOT/deploy.sh 
