class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def require_admin!
    authenticate_user!
    unless current_user.admin?
      flash[:alert] = "You must be an administrator."
      redirect_to root_path
    end
  end
end
