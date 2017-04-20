class CommentsController < ApplicationController
  def create
    @post = Post.friendly.find(params[:post_id])
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user
    if @comment.save
      flash[:notice] = "Thanks for the comment."
      redirect_to @post
    else
      redirect_to @post
    end
  end

  private
    def comment_params
      params.require(:comment).permit(:body)
    end
end
