USE [WriterController]
GO

ALTER TABLE [dbo].[article] DROP CONSTRAINT [DF_article_i_notebook_id]
GO

ALTER TABLE [dbo].[article] DROP CONSTRAINT [DF_article_i_latest_version_id]
GO

/****** Object:  Table [dbo].[article]    Script Date: 8/7/2013 8:31:58 PM ******/
DROP TABLE [dbo].[article]
GO

/****** Object:  Table [dbo].[article]    Script Date: 8/7/2013 8:31:58 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[article](
  [i_article_id] [int] IDENTITY(1,1) NOT NULL,
  [nvc_unique_address] [nvarchar](200) NOT NULL,
  [dt_inserted_datetime] [datetime] NOT NULL,
  [nvc_inserted_by] [nvarchar](100) NOT NULL,
  [dt_modified_datetime] [datetime] NULL,
  [nvc_modified_by] [nvarchar](100) NULL,
  [i_latest_version_id] [int] NOT NULL,
  [i_notebook_id] [int] NOT NULL,
 CONSTRAINT [PK_article] PRIMARY KEY CLUSTERED
(
  [i_article_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[article] ADD  CONSTRAINT [DF_article_i_latest_version_id]  DEFAULT ((1)) FOR [i_latest_version_id]
GO

ALTER TABLE [dbo].[article] ADD  CONSTRAINT [DF_article_i_notebook_id]  DEFAULT ((1)) FOR [i_notebook_id]
GO


