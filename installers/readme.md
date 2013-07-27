--7/26/2013--
**Note**: python-3.3.2 is currently not supported by node-gyp.
----------------
msnodesql-x64.msi is for building in local 64bit machine;
msnodesql-ia32.msi is for building under 32bit WOW/machine and deployed/used in Azure since Azure only support 32bit apps.
----------------
sqlncli.msi is to install SQL Server Native Client 10.0 ---> 10.0 is the default ODBC driver that azure supported. If 11.0 is installed, changing the connection string to use driver= Native Client 11.0 also works.
---------------
To run the local version and connect to SQL Azure, you need to add IP of the local machine into the FireWall rules in Azure portal