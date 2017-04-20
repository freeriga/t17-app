class Project < ApplicationRecord
  include FriendlyId
  friendly_id :name, use: [:slugged]
  validates :name, presence: true, length: { minimum: 3 }
  validates :description, presence: true, length: { minimum: 3 }
  belongs_to :user
  has_many :posts, -> { order "created_at DESC" }
end
