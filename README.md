## Description

Download multiple files from s3.

## Configuration - AWS Credentials

Make sure you have configured aws credentials in `~/.aws/credentials`

```Bash
  [roger_production]
  aws_access_key_id =  FAJSKDJFLASJKDLFKAJS
  aws_secret_access_key = ALSDJFLJ1L23J1L2JL31JL23JL12J3L1J2L3J1L

  [roger_staging]
  aws_access_key_id = A31LKJ2L41LJ2LKJ12L3
  aws_secret_access_key = 12312312JH3K12H3K1JH2K3H1K2H3K1H231JK2H

  [roger_test]
  aws_access_key_id = FALSJDFLJ12L3J1L2J3LL
  aws_secret_access_key = ASLDJFALSJDFLAJSLKDFJL1JL23J1LJ2L1L1LJ
```

## Configuration - AWS Config File

Create a new file `aws-config.json` (can be saved anywhere as you like it)

```JSON
  {
      "production": {                          // friendly name
          "profile": "roger_production",       // your aws profile name
          "bucket": "roger-production-bucket", // s3 bucket name
          "folder": "reports",                 // folder name
          "region": "us-east-1",
          "limit": 20,                         // max number of results (menu)
          "sortResult": "desc"                 // sort by name (default ascending)
      },
      "staging": {
          "profile": "roger_staging",
          "bucket": "roger-staging-bucket",
          "folder": "reports_staging",
          "region": "us-east-1",
          "limit": 10,
          "sortResult": "desc"
      },
      "test": {
          "profile": "roger_test",
          "bucket": "roger-test-bucket",
          "folder": "report_test",
          "region": "us-east-1",
          "limit": 10
      },
  }
```

## Configuration - Environment Variables

In your shell environment file, add a new export referencing the path to your `aws-config.json` file

```Bash
  export AWS_CONFIG='path_to/aws-config.json'
```

## How to use

After installing the package globally

```Bash
  npm i -g aws-s3-files
```

Run the command in your terminal

```Bash
  aws-s3-files production
  #                ^
  #                └── friendly name
```

![](https://i.imgur.com/2KivCKS.png)

![](https://i.imgur.com/jlYVMmb.png)

![](https://i.imgur.com/6FQt9FO.png)

Filter (optional)

```Bash
  aws-s3-files production 2021_08_04-22
  #                ^          ^
  #                |          └── filter
  #                └── friendly name
```

![](https://i.imgur.com/uAw2v7t.png)

You can always create an alias of your choice instead of using `aws-s3-files`, eg:

```Bash
  alias s3="aws-s3-files"
```

![](https://i.imgur.com/w5f1XKT.png)

![](https://i.imgur.com/g6aVlPa.png)
