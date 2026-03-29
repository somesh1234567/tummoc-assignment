terraform {
  backend "s3" {
    bucket       = "my-terraform-state-bucket-158"
    key          = "terraform.tfstate"
    region       = "us-east-1"
    use_lockfile = true
  }
}