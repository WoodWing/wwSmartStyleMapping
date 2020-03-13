# wwSmartStyleMapping
Map 'pseudo' styles from imported articles to real styles as defined in the target article frame.

This Enterprise Server plug-in deploys all the InDesign and InCopy event scripts and supporting scripts to implement the Smart Style Mapping functionality. Script deployment is based on this functionality:
https://helpcenter.woodwing.com/hc/en-us/articles/204807589-Automatically-deploying-event-scripts-for-Smart-Connection-in-InDesign-or-InCopy?mobile_site=true

# Installation:
- install the plug-in in Enteprise/config/plugins and activate in the admin UI
https://helpcenter.woodwing.com/hc/en-us/articles/209992006-Installing-a-custom-Enterprise-Server-plug-in-in-Enterprise-Server-10

# Configuration:
- The plugins and the scripts do not require configurations

# Making changes in the scripts:
- You can make and test changes in the local scripts in your InDesign or InCopy installation

# Deploying changes in the scripts:
- Replace the script in the Scripts/InDesign or Scripts/InCopy folder in the server plug-in
- Remove the zip file, select all the files and create a new zip file
- The plug-in will use the time stamp of the zip file as a version, so at next login in InDesign/InCopy the scripts will be redeployed

