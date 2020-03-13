<?php
/****************************************************************************
   Copyright 2019 WoodWing Software BV

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
****************************************************************************/

require_once BASEDIR . '/server/interfaces/services/sys/SysGetSubApplications_EnterpriseConnector.class.php';

class wwSmartStyleMapping_SysGetSubApplications extends SysGetSubApplications_EnterpriseConnector
{
	final public function getPrio()     { return self::PRIO_DEFAULT; }
	final public function getRunMode()  { return self::RUNMODE_BEFOREAFTER; }

	final public function runBefore( SysGetSubApplicationsRequest &$req )
	{	
	} 

	final public function runAfter( SysGetSubApplicationsRequest $req, SysGetSubApplicationsResponse &$resp )
	{
		if( is_null($req->ClientAppName) ||
			$req->ClientAppName == 'InDesign' ||
			$req->ClientAppName == 'InCopy'  ) {
			
			require_once BASEDIR . '/server/interfaces/services/sys/DataClasses.php';

			$zips = glob(dirname(__FILE__).'/Scripts/'.$req->ClientAppName.'/*.zip');

			LogHandler::Log( 'SmartStyleMapping', 'DEBUG', '/Scripts/'.$req->ClientAppName.'/*.zip' );
			LogHandler::Log( 'SmartStyleMapping', 'DEBUG', print_r($zips,1) );
	
			foreach ($zips as $zipfile) {

				$subApp = new SysSubApplication();
				$subApp->ID = 'SmartConnectionScripts_'.basename($zipfile,'.zip');

				// $zipfile = '/Scripts/'.$req->ClientAppName.'/Scripts.zip';
				$stat = stat($zipfile);
				$subApp->Version = strval($stat['mtime']);

				$subApp->PackageUrl = SERVERURL_ROOT.INETROOT.'/config/plugins/'.basename(dirname(__FILE__)).'/Scripts/'.$req->ClientAppName.'/'.basename($zipfile);
				
				$subApp->DisplayName = $subApp->ID;
				if( !is_null($req->ClientAppName) ) { 
					$subApp->ClientAppName = $req->ClientAppName;
				}
				else {
					$subApp->ClientAppName = 'InDesign';
				}
				$resp->SubApplications[] = $subApp;
			}
		}
		LogHandler::Log( 'SmartStyleMapping', 'DEBUG', 'Returns: SmartStyleMapping_SysGetSubApplications->runAfter()' );
	} 
	
	final public function onError( SysGetSubApplicationsRequest $req, BizException $e )
	{
		LogHandler::Log( 'SmartStyleMapping', 'DEBUG', 'Called: SmartStyleMapping_SysGetSubApplications->onError()' );
		require_once dirname(__FILE__) . '/config.php';

		LogHandler::Log( 'SmartStyleMapping', 'DEBUG', 'Returns: SmartStyleMapping_SysGetSubApplications->onError()' );
	} 
	
	// Not called.
	final public function runOverruled( SysGetSubApplicationsRequest $req )
	{
	}
}
