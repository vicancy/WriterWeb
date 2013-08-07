USE [WriterController]
GO
/****** Object:  StoredProcedure [dbo].[public_article_get_article_detail_by_id]    Script Date: 8/7/2013 8:30:05 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:    <Author,,Name>
-- Create date: <Create Date,,>
-- Description: <Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[public_article_get_article_detail_by_id](
  -- Add the parameters for the stored procedure here
  @article_id INT = 0
)
AS
BEGIN
  -- SET NOCOUNT ON added to prevent extra result sets from
  -- interfering with SELECT statements.
  SET NOCOUNT ON;
  select a.i_article_id as '_id',
    a.nvc_unique_address as 'Address',
    nb.i_account_id as 'UserId',
    Case
    When a.dt_modified_datetime is null THEN convert(nvarchar(16), a.dt_inserted_datetime, 120)
    ELSE convert(nvarchar(16), a.dt_modified_datetime, 120)
    END
    AS 'LastUpdatedDate',
    nb.nvc_notebook_name as 'NotebookName',
    nb.i_notebook_id as 'NotebookId',
    av.nvc_article_title as 'Title',
    av.nvc_article_content as 'Content',
    av.nvc_article_preview as 'Preview',
    av.nvc_article_abstract as 'Abstract'
    from article a
    join notebook nb
    on a.i_notebook_id = nb.i_notebook_id
    join article_version av
    on a.i_latest_version_id = av.i_version_id and a.i_article_id = av.i_article_id
    where a.i_article_id = @article_id

END
