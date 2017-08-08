class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :omniauthable, omniauth_providers: [:facebook]

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.name = auth.info.name
      user.image = auth.info.image
    end
  end

  before_save do
    if self.image
      self.image.gsub! /^http:/, "https:"
    end
  end

  def first_name
    name.split[0]
  end

  has_many :invitations
  belongs_to :invitation
  has_many :invited_users, class_name: "User", through: :invitations
  has_many :likes
end
