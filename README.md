# Visual-CancerDB

Visual CancerDB is a website that displays data from the https://cancerdb.com public database that contains data on all cancer treatments and related entities.

Someone's new treatment could be just 2 ideas away from being the next big cure. CancerDB can help you discover what those 2 missing pieces of knowledge are.

For cancer patients and their loved ones, we want to bring you the absolute best facts about cancer. We will deliver that information to you quickly, free of charge and you can trust it 100%.

The site does not yet have a domain and cannot be navigated.
In this initial stage it is uploaded to the AWS instance --> http://ec2-18-230-108-113.sa-east-1.compute.amazonaws.com/ but it is not available 100% of the time.

<b>To upload a case</b>

To register a new case, touch the upload button at the top right of the site. For now, this is without security and anyone can do it in this initial version.

<b>To delete a case</b>

There is no interface on the web to do it from the site but you can place delete by placing "/delete/ok" in the URL where we are seeing the case.
url "/image/6352d3a3cfa0c5cbf376d92c"
add
url "/image/6352d3a3cfa0c5cbf376d92c/delete/ok" to remove it.

<b>To build the full site locally</b>

Te site is set up to slow it down in a docker with docker-compose and these are the instructions:

As a precondition you must have docker and docker compose installed in your local machine.

1- Go to the command line in the folder where you have the downloaded project. For example c:/Visual-CancerDB
2-
```bash
npm i express ejs fs-extra mongoose morgan multer timeago.js uuid
```
// run this in the local folder with the project
3-
```bash
 docker-compose build
```
4-
```bash
docker-compose up
```
5- navigate to http://localhost:80