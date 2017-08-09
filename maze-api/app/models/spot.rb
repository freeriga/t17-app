class Spot < ApplicationRecord
  belongs_to :maze
  has_one    :clip
end
