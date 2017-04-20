require 'test_helper'

class ProjectsControllerTest < ActionDispatch::IntegrationTest
  test "create project" do
    get new_project_url
    assert_response :success
  end

  test "edit project" do
    get edit_project_url(projects(:x))
    assert_response :success
  end
end
