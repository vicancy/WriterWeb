USE [WriterController]
GO

/****** Object:  Table [dbo].[article_version]    Script Date: 8/7/2013 8:32:13 PM ******/
DROP TABLE [dbo].[article_version]
GO

/****** Object:  Table [dbo].[article_version]    Script Date: 8/7/2013 8:32:13 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[article_version](
  [i_article_id] [int] NOT NULL,
  [i_version_id] [int] NOT NULL,
  [i_inserted_by] [nvarchar](100) NOT NULL,
  [dt_inserted_by_datetime] [datetime] NOT NULL,
  [nvc_article_title] [nvarchar](200) NOT NULL,
  [nvc_article_abstract] [nvarchar](2000) NULL,
  [nvc_article_content] [ntext] NULL,
  [nvc_article_preview] [ntext] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO


