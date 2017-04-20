class PostsController < ApplicationController
  def new
    @project = Project.friendly.find(params[:project_id])
    @post = @project.posts.build
    @post.user = current_user
  end
  
  def edit
    @post = Post.friendly.find(params[:id])
    @project = @post.project
  end

  def post
    @post = Post.friendly.find(params[:id])
    if @post.update(post_params)
      redirect_to @post
    else
      render 'edit'
    end
  end

  def create
    @project = Project.friendly.find(params[:project_id])
    @post = @project.posts.build(post_params)
    @post.user = current_user
    if @post.save
      flash[:notice] = "Thanks for the post."
      redirect_to @project
    else
      render 'new'
    end
  end

  def update
    @post = Post.friendly.find(params[:id])
    if @post.update(post_params)
      redirect_to @post
    else
      render 'edit'
    end
  end

  def show
    @post = Post.friendly.find(params[:id])
    @can_edit = user_signed_in? and current_user.admin?
  end

  def like
    post = Post.friendly.find(params[:post_id])
    post.likes.build(user: current_user).save!
    redirect_to post
  end

  private
    def post_params
      params.require(:post).permit(:title, :body)
    end
end
