USE [WriterController]
GO
/****** Object:  StoredProcedure [dbo].[public_article_get_available_articles]    Script Date: 8/7/2013 8:30:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:    <Author,,Name>
-- Create date: <Create Date,,>
-- Description: <Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[public_article_get_available_articles](
  -- Add the parameters for the stored procedure here
  @user_id INT = 0,
  @notebook_id INT = 0,
  @count INT = 0
)
AS
BEGIN
  -- SET NOCOUNT ON added to prevent extra result sets from
  -- interfering with SELECT statements.
  SET NOCOUNT ON;

  -- @count = 0 means fetch out all the records
  IF @count <> 0
  BEGIN
    SET rowcount @count
  END

  DECLARE @sql varchar(2000)= '
  select a.i_article_id as ''_id'',
    a.nvc_unique_address as ''Address'',
    Case
    When a.dt_modified_datetime is null THEN convert(nvarchar(16), a.dt_inserted_datetime, 120)
    ELSE convert(nvarchar(16), a.dt_modified_datetime, 120)
    END
    AS ''LastUpdatedDate'',
    nb.nvc_notebook_name as ''NotebookName'', av.nvc_article_title as ''Title'',
    av.nvc_article_abstract as ''Abstract''
    from article a
    join notebook nb
    on a.i_notebook_id = nb.i_notebook_id
    join article_version av
    on a.i_latest_version_id = av.i_version_id and a.i_article_id = av.i_article_id '
  IF @user_id + @notebook_id <> 0
  BEGIN
    SET @sql = @sql + 'WHERE'
    IF @user_id <> 0
    BEGIN
      SET @sql = @sql + ' nb.i_account_id = ' + convert(varchar(32), @user_id)
    END
    IF @notebook_id <> 0
    BEGIN
      SET @sql = @sql + ' AND nb.i_notebook_id = ' + convert(varchar(32), @notebook_id)
    END
  END

  SET @sql = @sql + ' order by a.dt_modified_datetime desc'
  PRINT(@sql)

  EXEC(@sql)
END
