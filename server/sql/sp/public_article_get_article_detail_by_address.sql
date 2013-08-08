USE [WriterController]
GO

/****** Object:  StoredProcedure [dbo].[public_article_get_article_detail_by_address]    Script Date: 8/8/2013 7:35:15 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[public_article_get_article_detail_by_address](
	-- Add the parameters for the stored procedure here
	@nvc_unique_address nvarchar(200)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @articleId INT = NULL;
	SELECT @articleId = i_article_id 
	FROM article 
	WHERE nvc_unique_address = @nvc_unique_address

	IF @articleId IS NOT NULL
	BEGIN
		exec [public_article_get_article_detail_by_id] @article_id = @articleId
	END
END

GO


