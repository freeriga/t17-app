require 'test_helper'

class PostsControllerTest < ActionDispatch::IntegrationTest
  test "edit post" do
    get edit_post_url(posts(:hello1))
    assert_response :success
  end
end
