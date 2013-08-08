USE [WriterController]
GO

/****** Object:  StoredProcedure [dbo].[public_account_get_account]    Script Date: 8/8/2013 7:34:30 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[public_account_get_account](
	-- Add the parameters for the stored procedure here
	@i_account_id INT = 0,
	@nvc_account_name nvarchar(100) = NULL
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @sql varchar(2000)= '
	select [i_account_id] as ''_id''
      ,[nvc_account_name] as ''Name''
      ,[nvc_account_description] as ''Description''
      ,[vc_account_password] as ''Password''
      ,[vc_account_email] as ''Email''
      ,[nvc_account_nickname] as ''Nickname''
      ,[xml_account_details] as ''Details''
	from account'

	IF (@i_account_id <> 0 or @nvc_account_name IS NOT NULL)
	BEGIN
		SET @sql = @sql + ' WHERE' 
		IF (@i_account_id <> 0)
		BEGIN
		SET @sql = @sql + ' i_account_id = ' + convert(varchar(32), @i_account_id)
		END

		IF (@nvc_account_name IS NOT NULL)
		BEGIN
			SET @sql = @sql + ' nvc_account_name = ''' +  @nvc_account_name + ''''
		END
		
	END

	EXEC(@sql)
END


GO


