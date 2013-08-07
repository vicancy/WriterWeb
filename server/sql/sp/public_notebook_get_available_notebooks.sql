USE [WriterController]
GO
/****** Object:  StoredProcedure [dbo].[public_notebook_get_available_notebooks]    Script Date: 8/7/2013 8:30:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:    <Author,,Name>
-- Create date: <Create Date,,>
-- Description: <Description,,>
-- =============================================
ALTER PROCEDURE [dbo].[public_notebook_get_available_notebooks](
  -- Add the parameters for the stored procedure here
  @user_id INT,
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
    -- Insert statements for procedure here
  SELECT
  i_notebook_id as '_id',
  nvc_notebook_name as 'name',
  nvc_notebook_description as 'description'
  from notebook where i_account_id = @user_id order by i_article_count desc;
END
