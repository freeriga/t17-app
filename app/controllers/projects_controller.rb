class ProjectsController < ApplicationController
  def show
    @project = Project.friendly.find(params[:id])
    @residents = User.where(admin: true)
    @can_post = user_signed_in? and @residents.include?(current_user)
    @can_edit = @can_post
  end
  
  def new
    @project = Project.new(user: current_user)
  end

  def edit
    @project = Project.friendly.find(params[:id])
  end
  
  def create
    @project = Project.new(project_params)
    @project.user = current_user
    if @project.save
      flash[:notice] = "New project started. Good luck."
      redirect_to @project
    else
      render 'new'
    end
  end

  def update
    @project = Project.friendly.find(params[:id])
    if @project.update(project_params)
      redirect_to @project
    else
      render 'edit'
    end
  end

  def map
    @project = Project.friendly.find(params[:id])
    render layout: "map"
  end

  private
    def project_params
      params.require(:project).permit(:name, :description, :homepage)
    end
end
