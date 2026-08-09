provider "aws" {
  region = "us-east-2"  # Change this to your desired AWS region
}

resource "aws_instance" "wordpress" {
  ami           = "ami-0c55b159cbfafe1f0"  # Change this to the desired AWS AMI for your region and instance type
  instance_type = "t2.micro"  # Change this to the desired instance type

  tags = {
    Name = "WordPressInstance"
  }
}

resource "aws_security_group" "wordpress_sg" {
  name_prefix = "wordpress-sg-"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_network_interface_sg_attachment" "wordpress_sg_attachment" {
  security_group_id    = aws_security_group.wordpress_sg.id
  network_interface_id = aws_instance.wordpress.network_interface_ids[0]
}

resource "aws_key_pair" "example" {
  key_name   = "terraform2"  # Change this to your desired key name
  public_key = "-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1zqFb2Tb1AAKuVShy8hY
n+Mwp4iqoxvkVaYh97hwyMKQMTBa7WCr63SF2GyIOCGypFlq/gHj4Ne/9B78llUy
3kuos5O5pQicXjm8s/eW9UdBEB/Kjv99iUekwq8t7Eu5Z1QmAnl1ODiFxZXDplEK
fD7jhKD5WW8126WFp2h74JAb5tKbvl4nZwk+nmtSxPLHFEeM23so5H+KUYxYFLSF
SqMEudMN+iKVE9B1jepmE04lOrIo5zQr1ToSModIdd3ZYqJwVf0WIvWdrbUU+zx7
kwQkEj2FY/t4Rx6B/pooMo5Zgrh4JLL+hUcfGKb8GKDg0WgQHKxtYkDUhQpZeuur
eQIDAQAB
-----END PUBLIC KEY-----"  # Change this to your public SSH key
}

# Provisioning script to install WordPress
provisioner "remote-exec" {
  inline = [
    "sudo yum update -y",
    "sudo amazon-linux-extras install -y lamp-mariadb10.2-php7.2 php7.2",
    "sudo yum install -y httpd mariadb-server",
    "sudo systemctl start httpd",
    "sudo systemctl enable httpd",
    "sudo systemctl start mariadb",
    "sudo systemctl enable mariadb",
    "sudo mysql_secure_installation",  # Follow the prompts to set up MariaDB
    "sudo amazon-linux-extras install -y epel",
    "sudo yum install -y phpmyadmin",  # Optional: Install phpMyAdmin for database management
    "sudo systemctl restart httpd",
  ]
}

output "wordpress_public_ip" {
  value = aws_instance.wordpress.public_ip
}
