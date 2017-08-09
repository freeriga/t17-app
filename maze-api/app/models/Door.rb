class Door < ApplicationRecord
  belongs_to :src, class_name: "Spot", foreign_key: "src"
  belongs_to :dst, class_name: "Spot", foreign_key: "dst"
end