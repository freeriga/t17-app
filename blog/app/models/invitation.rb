class Invitation < ApplicationRecord
  has_secure_token
  belongs_to :user
  belongs_to :invitee, class_name: "User", optional: true
end
