class HomeController < ApplicationController
  def index
    @projects = Project.all
    @residents = User.where(admin: true).order(:name)
    @snippet = Config.find_or_create_by(key: "home-snippet").value
  end
end
