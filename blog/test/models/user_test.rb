require 'test_helper'

class UserTest < ActiveSupport::TestCase
  test "save with http image" do
    assert_equal "https://x", create(:user, image: "http://x").image
  end
end
