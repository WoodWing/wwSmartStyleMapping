# wwSmartStyleMapping
Map 'pseudo' styles from imported articles to real styles as defined in the target article frame.

This Enterprise Server plug-in deploys all the InDesign and InCopy event scripts and supporting scripts to implement the Smart Style Mapping functionality.

# Installation:
- install the plug-in in Enteprise/config/plugins and activate in the admin UI

# Configuration:
- The plugins and the scripts do not require configurations

# Making changes in the scripts:
- You can make and test changes in the local scripts in your InDesign or InCopy installation

# Deploying changes in the scripts:
- Replace the script in the Scripts/InDesign or Scripts/InCopy folder in the server plug-in
- Remove the zip file, select all the files and create a new zip file
- The plug-in will use the time stamp of the zip file as a version, so at next login in InDesign/InCopy the scripts will be redeployed

