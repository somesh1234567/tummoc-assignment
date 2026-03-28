terraform {
  backend "s3" {
    bucket = "my-terraform-state-bucket-157"
    key    = "terraform.tfstate"
    region = "us-east-1"
    use_lockfile = true
  }
}