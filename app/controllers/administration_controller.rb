class AdministrationController < ApplicationController
  before_action :require_admin!

  def index
    @users = User.where(admin: nil)
    @admins = User.where(admin: true)
    @invitations = Invitation.all
    @projects = Project.all
    @snippet = Config.find_or_create_by(key: "home-snippet").value
  end

  def save
    @snippet = Config.find_or_create_by(key: "home-snippet")
    @snippet.update!(value: params[:home_snippet])
    redirect_to :administer
  end

  def invite
    Invitation.create(user: current_user)
    redirect_to :administer
  end

  def make_admin
    user = User.find(params["user_id"])
    user.admin = true
    user.save!
    flash[:notice] = "#{user.name} is now an admin."
    redirect_to :administer
  end
end
