USE [WriterController]
GO

/****** Object:  Table [dbo].[account]    Script Date: 8/7/2013 8:31:06 PM ******/
DROP TABLE [dbo].[account]
GO

/****** Object:  Table [dbo].[account]    Script Date: 8/7/2013 8:31:06 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

SET ANSI_PADDING ON
GO

CREATE TABLE [dbo].[account](
  [i_account_id] [int] IDENTITY(1,1) NOT NULL,
  [nvc_account_name] [nvarchar](100) NOT NULL,
  [nvc_account_description] [nvarchar](2000) NULL,
  [vc_account_password] [varchar](256) NOT NULL,
  [vc_account_email] [varchar](100) NULL,
  [nvc_account_nickname] [nvarchar](100) NULL,
  [xml_account_details] [xml] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]

GO

SET ANSI_PADDING OFF
GO


