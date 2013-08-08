USE [WriterController]
GO

/****** Object:  StoredProcedure [dbo].[public_account_add_new_account]    Script Date: 8/8/2013 7:33:56 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[public_account_add_new_account]
	-- Add the parameters for the stored procedure here
	(
	@nvc_account_name nvarchar(100),
	@nvc_account_description nvarchar(2000) = NULL,
	@vc_account_password varchar(256),
	@vc_account_email varchar(100) = NULL,
	@nvc_account_nickname nvarchar(100) = NULL,
	@xml_account_details xml = NULL
	)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @userId INT;
    -- IF Account Exists
	IF EXISTS
	(
		SELECT 'X' FROM ACCOUNT WHERE nvc_account_name = @nvc_account_name
	)
	BEGIN
		RAISERROR (N'THE ACCOUNT ALREADY EXISTS %s.', -- Message text.
           12, -- Severity,
           1, -- State,
           @nvc_account_name -- First argument.
           ); -- Second argument.
		return 1;
-- The message text returned is: This is message number 5.
	END

	INSERT INTO [dbo].[account]
           ([nvc_account_name]
           ,[nvc_account_description]
           ,[vc_account_password]
           ,[vc_account_email]
           ,[nvc_account_nickname]
           ,[xml_account_details])
     VALUES
           (@nvc_account_name
           ,@nvc_account_description
           ,@vc_account_password
           ,@vc_account_email
           ,@nvc_account_nickname
           ,@xml_account_details);
			
	EXEC [private_notebook_add_default_notebooks_by_name] @nvc_account_name = @nvc_account_name

	EXEC public_account_get_account @nvc_account_name = @nvc_account_name
	
	return 0;
END

GO


