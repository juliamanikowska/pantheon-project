Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/jammy64"

  # FRONTEND
  config.vm.define "frontend_2" do |frontend|
    frontend.vm.network "private_network", ip: "192.168.56.10"
    frontend.vm.network "forwarded_port", guest: 80, host: 8080, :host_ip => "127.0.0.1"

    frontend.vm.provision "ansible" do |ansible|
      ansible.playbook = "frontend.yml"
    end
  end

  # BACKEND
  config.vm.define "backend" do |backend|
    backend.vm.network "private_network", ip: "192.168.56.11"

    backend.vm.provision "ansible" do |ansible|
      ansible.playbook = "backend.yml"
    end
  end

  # DB
  config.vm.define "db" do |db|
    db.vm.network "private_network", ip: "192.168.56.12"

    db.vm.provision "ansible" do |ansible|
      ansible.playbook = "db.yml"
    end
  end

end
