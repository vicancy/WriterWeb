USE [WriterController]
GO

/****** Object:  StoredProcedure [dbo].[private_notebook_add_default_notebooks]    Script Date: 8/8/2013 7:32:40 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[private_notebook_add_default_notebooks](
	-- Add the parameters for the stored procedure here
	@user_id INT
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @defaultNotebookName nvarchar(50) = 'My Notebook'
	DECLARE @user nvarchar(100);
	-- Verify if modified-by account id is valid
	SELECT @user = nvc_account_name 
	FROM account 
	WHERE i_account_id = @user_id		
	
	IF @user IS NULL
	BEGIN
		RAISERROR (N'THE ACCOUNT DOES NOT EXISTS %d.', -- Message text.
			11, -- Severity,
			1, -- State,
			@user_id -- First argument.
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
           ,@user
           ,@user_id
		   )

	 return 0;

END


GO


