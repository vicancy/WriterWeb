USE [WriterController]
GO

/****** Object:  StoredProcedure [dbo].[public_article_add_new_article]    Script Date: 8/8/2013 7:34:50 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[public_article_add_new_article]
	-- Add the parameters for the stored procedure here
	(
	@i_notebook_id INT,
	@nvc_unique_address nvarchar(200) = NULL,
	@nvc_article_title nvarchar(200),
	@nvc_article_abstract nvarchar(2000) = NULL,
	@nvc_article_content ntext = NULL,
	@i_account_id INT
	)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	DECLARE @version INT = 1; -- Newly added record with version = 1
	DECLARE @user NVARCHAR(200) = NULL;
	DECLARE @currentDate DATETIME;
	DECLARE @articleId INT;

	-- Verify if notebook id is valid
	IF NOT EXISTS
	(
		SELECT 'X' FROM notebook WHERE i_notebook_id = @i_notebook_id		
	)
	BEGIN
		RAISERROR (N'THE NOTEBOOK DOES NOT EXISTS %d.', -- Message text.
			11, -- Severity,
			1, -- State,
			@i_notebook_id -- First argument.
			); -- Second argument.
		return 1
	END
	
	-- Verify if account id is valid
	SELECT @user = nvc_account_name 
	FROM account 
	WHERE i_account_id = @i_account_id		
	
	IF @user IS NULL
	BEGIN
		RAISERROR (N'THE ACOUNT DOES NOT EXISTS %d.', -- Message text.
			11, -- Severity,
			1, -- State,
			@i_account_id -- First argument.
			); -- Second argument.
		return 1
	END

	IF @nvc_unique_address IS NULL
	-- IF the address is not specified, generate one
	BEGIN
		SET @nvc_unique_address = convert(varchar(36), NEWID());
		--TODO: Double check if the address is unique
	END
	ELSE
    -- IF the address already exists
	BEGIN
		IF EXISTS
		(
			SELECT 'X' FROM article WHERE nvc_unique_address = @nvc_unique_address
		)
		BEGIN
			RAISERROR (N'THE ADDRESS ALREADY EXISTS %s.', -- Message text.
			   11, -- Severity,
			   1, -- State,
			   @nvc_unique_address -- First argument.
			   ); -- Second argument.
			return 1
		END
	END
	
	BEGIN TRANSACTION
	SET @currentDate = GETDATE();
	INSERT INTO [dbo].[article]
           ([nvc_unique_address]
           ,[dt_inserted_datetime]
           ,[nvc_inserted_by]
           ,[i_latest_version_id]
           ,[i_notebook_id])
     VALUES
          (@nvc_unique_address
           ,@currentDate
           ,@user
           ,@version						
		   ,@i_notebook_id);
	
	-- Get the identity of the newly added record
	SELECT @articleId = i_article_id 
	FROM article 
	WHERE nvc_unique_address = @nvc_unique_address

    INSERT INTO [dbo].[article_version]
           ([i_article_id]
           ,[i_version_id]
           ,[i_inserted_by]
           ,[dt_inserted_by_datetime]
           ,[nvc_article_title]
           ,[nvc_article_abstract]
           ,[nvc_article_content])
     VALUES
           (@articleId
			,@version
			,@user
			,@currentDate
			,@nvc_article_title
			,@nvc_article_abstract
			,@nvc_article_content	
		   )

	COMMIT TRANSACTION

	-- RETURN articleId and unique address
	EXEC [public_article_get_available_articles] @user_id = @i_account_id, @notebook_id = @i_notebook_id
	
	return 0
END

GO


