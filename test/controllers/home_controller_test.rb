require 'test_helper'

class HomeControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get root_url
    assert_response :success
    assert_select "header"
    assert_select "project", Project.count
    assert_select ".resident", User.where(admin: true).count
  end
end
