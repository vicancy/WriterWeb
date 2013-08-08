USE [WriterController]
GO

/****** Object:  StoredProcedure [dbo].[private_notebook_add_default_notebooks_by_name]    Script Date: 8/8/2013 7:33:32 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[private_notebook_add_default_notebooks_by_name](
	-- Add the parameters for the stored procedure here
	@nvc_account_name nvarchar(100)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @defaultNotebookName nvarchar(50) = 'My Notebook'
	DECLARE @userId INT = NULL
	-- Verify if modified-by account id is valid
	SELECT @userId = i_account_id 
	FROM account 
	WHERE nvc_account_name = @nvc_account_name		
	
	IF @userId IS NULL
	BEGIN
		RAISERROR (N'THE ACCOUNT DOES NOT EXISTS %s.', -- Message text.
			11, -- Severity,
			1, -- State,
			@nvc_account_name -- First argument.
			); -- Second argument.
		return 1;
	END


	INSERT INTO [dbo].[notebook]
           ([nvc_notebook_name]
           ,[dt_inserted_datetime]
           ,[dt_inserted_by]
           ,[i_account_id])
     VALUES
           (@defaultNotebookName
           ,getdate()
           ,@nvc_account_name
           ,@userId
		   )

	 return 0
END


GO


