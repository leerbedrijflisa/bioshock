<?xml version="1.0" encoding="utf-8"?>
<serviceModel xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" name="Lisa.CloudService" generation="1" functional="0" release="0" Id="6acdfa9c-f9df-4b39-a92d-7e1ff73f2af0" dslVersion="1.2.0.0" xmlns="http://schemas.microsoft.com/dsltools/RDSM">
  <groups>
    <group name="Lisa.CloudServiceGroup" generation="1" functional="0" release="0">
      <componentports>
        <inPort name="Lisa.Bioshock:Endpoint1" protocol="http">
          <inToChannel>
            <lBChannelMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/LB:Lisa.Bioshock:Endpoint1" />
          </inToChannel>
        </inPort>
      </componentports>
      <settings>
        <aCS name="Lisa.Bioshock:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="">
          <maps>
            <mapMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/MapLisa.Bioshock:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </maps>
        </aCS>
        <aCS name="Lisa.BioshockInstances" defaultValue="[1,1,1]">
          <maps>
            <mapMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/MapLisa.BioshockInstances" />
          </maps>
        </aCS>
      </settings>
      <channels>
        <lBChannel name="LB:Lisa.Bioshock:Endpoint1">
          <toPorts>
            <inPortMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/Lisa.Bioshock/Endpoint1" />
          </toPorts>
        </lBChannel>
      </channels>
      <maps>
        <map name="MapLisa.Bioshock:Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" kind="Identity">
          <setting>
            <aCSMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/Lisa.Bioshock/Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" />
          </setting>
        </map>
        <map name="MapLisa.BioshockInstances" kind="Identity">
          <setting>
            <sCSPolicyIDMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/Lisa.BioshockInstances" />
          </setting>
        </map>
      </maps>
      <components>
        <groupHascomponents>
          <role name="Lisa.Bioshock" generation="1" functional="0" release="0" software="C:\Lisa\Lisa.CloudService\csx\Debug\roles\Lisa.Bioshock" entryPoint="base\x64\WaHostBootstrapper.exe" parameters="base\x64\WaIISHost.exe " memIndex="1792" hostingEnvironment="frontendadmin" hostingEnvironmentVersion="2">
            <componentports>
              <inPort name="Endpoint1" protocol="http" portRanges="80" />
            </componentports>
            <settings>
              <aCS name="Microsoft.WindowsAzure.Plugins.Diagnostics.ConnectionString" defaultValue="" />
              <aCS name="__ModelData" defaultValue="&lt;m role=&quot;Lisa.Bioshock&quot; xmlns=&quot;urn:azure:m:v1&quot;&gt;&lt;r name=&quot;Lisa.Bioshock&quot;&gt;&lt;e name=&quot;Endpoint1&quot; /&gt;&lt;/r&gt;&lt;/m&gt;" />
            </settings>
            <resourcereferences>
              <resourceReference name="DiagnosticStore" defaultAmount="[4096,4096,4096]" defaultSticky="true" kind="Directory" />
              <resourceReference name="EventStore" defaultAmount="[1000,1000,1000]" defaultSticky="false" kind="LogStore" />
            </resourcereferences>
          </role>
          <sCSPolicy>
            <sCSPolicyIDMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/Lisa.BioshockInstances" />
            <sCSPolicyUpdateDomainMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/Lisa.BioshockUpgradeDomains" />
            <sCSPolicyFaultDomainMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/Lisa.BioshockFaultDomains" />
          </sCSPolicy>
        </groupHascomponents>
      </components>
      <sCSPolicy>
        <sCSPolicyUpdateDomain name="Lisa.BioshockUpgradeDomains" defaultPolicy="[5,5,5]" />
        <sCSPolicyFaultDomain name="Lisa.BioshockFaultDomains" defaultPolicy="[2,2,2]" />
        <sCSPolicyID name="Lisa.BioshockInstances" defaultPolicy="[1,1,1]" />
      </sCSPolicy>
    </group>
  </groups>
  <implements>
    <implementation Id="b534f7da-67e1-486d-be0c-f92905780fdf" ref="Microsoft.RedDog.Contract\ServiceContract\Lisa.CloudServiceContract@ServiceDefinition">
      <interfacereferences>
        <interfaceReference Id="44409478-e8c5-469c-a400-77e48c383a43" ref="Microsoft.RedDog.Contract\Interface\Lisa.Bioshock:Endpoint1@ServiceDefinition">
          <inPort>
            <inPortMoniker name="/Lisa.CloudService/Lisa.CloudServiceGroup/Lisa.Bioshock:Endpoint1" />
          </inPort>
        </interfaceReference>
      </interfacereferences>
    </implementation>
  </implements>
</serviceModel>