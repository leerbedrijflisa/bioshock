<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="Lisa.Cloud" generation="1" functional="0" release="0" Id="12705c7c-f08a-4b6f-9a67-81b36d73da4f" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="Lisa.CloudGroup" generation="1" functional="0" release="0">
      <settings>
        <aCS name="Lisa.Cloud.Worker:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/Lisa.Cloud/Lisa.CloudGroup/MapLisa.Cloud.Worker:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="Lisa.Cloud.Worker:StorageConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/Lisa.Cloud/Lisa.CloudGroup/MapLisa.Cloud.Worker:StorageConnectionString" />
          </maps>
        </aCS>
        <aCS name="Lisa.Cloud.WorkerInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/Lisa.Cloud/Lisa.CloudGroup/MapLisa.Cloud.WorkerInstances" />
          </maps>
        </aCS>
      </settings>
      <maps>
        <map name="MapLisa.Cloud.Worker:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/Lisa.Cloud/Lisa.CloudGroup/Lisa.Cloud.Worker/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapLisa.Cloud.Worker:StorageConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/Lisa.Cloud/Lisa.CloudGroup/Lisa.Cloud.Worker/StorageConnectionString" />
          </setting>
        </map>
        <map name="MapLisa.Cloud.WorkerInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/Lisa.Cloud/Lisa.CloudGroup/Lisa.Cloud.WorkerInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="Lisa.Cloud.Worker" generation="1" functional="0" release="0" software="C:\Users\Marijn Kok\Documents\GitHub\bioshock\Lisa.Cloud\csx\Debug\roles\Lisa.Cloud.Worker" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaWorkerHost.exe " memIndex="1792" hostingEnvironment="consoleroleadmin" hostingEnvironmentVersion="2">
            <settings>
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="StorageConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;Lisa.Cloud.Worker&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;Lisa.Cloud.Worker&quot; /&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/Lisa.Cloud/Lisa.CloudGroup/Lisa.Cloud.WorkerInstances" />
            <sCSPolicyUpdateDomainMoniker name="/Lisa.Cloud/Lisa.CloudGroup/Lisa.Cloud.WorkerUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/Lisa.Cloud/Lisa.CloudGroup/Lisa.Cloud.WorkerFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="Lisa.Cloud.WorkerUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="Lisa.Cloud.WorkerFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="Lisa.Cloud.WorkerInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
</serviceModel>