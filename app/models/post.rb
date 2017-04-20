class Post < ApplicationRecord
  include FriendlyId
  friendly_id :slug_candidates, use: [:slugged]
  
  belongs_to :project
  belongs_to :user

  has_many :comments
  
  def slug_candidates
    [:title, [:title, :project_name]]
  end

  def project_name
    project.name
  end
end
