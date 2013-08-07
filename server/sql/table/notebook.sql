USE [WriterController]
GO

ALTER TABLE [dbo].[notebook] DROP CONSTRAINT [DF_notebook_i_article_count]
GO

/****** Object:  Table [dbo].[notebook]    Script Date: 8/7/2013 8:32:26 PM ******/
DROP TABLE [dbo].[notebook]
GO

/****** Object:  Table [dbo].[notebook]    Script Date: 8/7/2013 8:32:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[notebook](
  [i_notebook_id] [int] IDENTITY(1,1) NOT NULL,
  [nvc_notebook_name] [nvarchar](50) NOT NULL,
  [nvc_notebook_description] [nvarchar](2000) NULL,
  [dt_inserted_datetime] [datetime] NOT NULL,
  [dt_inserted_by] [nvarchar](100) NOT NULL,
  [dt_modified_datetime] [datetime] NULL,
  [dt_modified_by] [nvarchar](100) NULL,
  [i_article_count] [int] NOT NULL,
  [i_account_id] [int] NOT NULL,
 CONSTRAINT [PK_notebook_1] PRIMARY KEY CLUSTERED
(
  [i_notebook_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO

ALTER TABLE [dbo].[notebook] ADD  CONSTRAINT [DF_notebook_i_article_count]  DEFAULT ((0)) FOR [i_article_count]
GO


