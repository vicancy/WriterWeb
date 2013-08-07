USE [WriterController]
GO
/****** Object:  StoredProcedure [dbo].[public_article_update_article]    Script Date: 8/7/2013 8:30:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:    <Author,,Name>
-- Create date: <Create Date,,>
-- Description: <Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[public_article_update_article]
  -- Add the parameters for the stored procedure here
  (
  @i_article_id INT,
  @i_modified_by_account_id nvarchar(100),
  @nvc_article_title nvarchar(200) = NULL,
  @nvc_article_abstract nvarchar(2000) = NULL,
  @nvc_article_content ntext = NULL,
  @nvc_article_preview ntext = NULL,
  @i_notebook_id INT
  )
AS
BEGIN
  -- SET NOCOUNT ON added to prevent extra result sets from
  -- interfering with SELECT statements.
  SET NOCOUNT ON;

  DECLARE @curVersion INT;
  DECLARE @user NVARCHAR(200) = NULL;
  DECLARE @currentDate DATETIME;

  -- Verify if notebook id is valid
  IF NOT EXISTS
  (
    SELECT 'X' FROM notebook WHERE i_notebook_id = @i_notebook_id
  )
  BEGIN
    RAISERROR (N'THE NOTEBOOK DOES NOT EXISTS %d.', -- Message text.
      10, -- Severity,
      1, -- State,
      @i_notebook_id -- First argument.
      ); -- Second argument.
  END

  -- Verify if article id is valid
  IF NOT EXISTS
  (
    SELECT 'X' FROM article WHERE i_article_id = @i_article_id
  )
  BEGIN
    RAISERROR (N'THE ARTICLE DOES NOT EXISTS %d.', -- Message text.
      10, -- Severity,
      1, -- State,
      @i_article_id -- First argument.
      ); -- Second argument.
  END

  -- Verify if modified-by account id is valid
  SELECT @user = nvc_account_name
  FROM account
  WHERE i_account_id = @i_modified_by_account_id

  IF @user IS NULL
  BEGIN
    RAISERROR (N'THE ACOUNT DOES NOT EXISTS %d.', -- Message text.
      10, -- Severity,
      1, -- State,
      @i_modified_by_account_id -- First argument.
      ); -- Second argument.
  END


  BEGIN TRANSACTION
    SET @currentDate = GETDATE();
    SELECT @curVersion = MAX(i_version_id) + 1
    FROM article_version
    WHERE i_article_id = @i_article_id

    INSERT INTO [dbo].[article_version]
        ([i_article_id]
        ,[i_version_id]
        ,[i_inserted_by]
        ,[dt_inserted_by_datetime]
        ,[nvc_article_title]
        ,[nvc_article_abstract]
        ,[nvc_article_content])
      VALUES
        (@i_article_id
        ,@curVersion
        ,@user
        ,@currentDate
        ,@nvc_article_title
        ,@nvc_article_abstract
        ,@nvc_article_content
        )

    UPDATE [dbo].[article]
    SET
    dt_modified_datetime = @currentDate
    ,nvc_modified_by = @user
    ,i_latest_version_id = @curVersion
    ,i_notebook_id = @i_notebook_id
    WHERE i_article_id = @i_article_id

  COMMIT TRANSACTION

END
