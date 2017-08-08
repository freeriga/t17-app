require 'test_helper'

class PostsControllerTest < ActionDispatch::IntegrationTest
  test "edit post" do
    get edit_project_post_url(posts(:hello1).project, posts(:hello1))
    assert_response :success
  end
end
