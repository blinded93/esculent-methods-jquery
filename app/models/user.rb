class User < ApplicationRecord
  validates :email, :username,
      presence: true,
      uniqueness: true
  has_secure_password
  mount_uploader :avatar, AvatarUploader

  has_many :recipes
  has_many :favorited_recipes
  has_many :favorites,
      through: :favorited_recipes,
      source: :recipe
  has_many :received_messages,
      class_name: 'Message',
      primary_key: 'id',
      foreign_key: 'recipient_id',
      dependent: :destroy
  has_many :sent_messages,
      class_name: 'Message',
      primary_key: 'id',
      foreign_key: 'sender_id',
      dependent: :destroy
  has_many :friendships
  has_many :friends,
      through: :friendships,
      source: :friend
  
  scope :from_email, -> (email) { where("email like ?", "%#{email}%") }
  scope :from_username, -> (username) { where("username like ?", "%#{username}%") }
  scope :preview, -> () { order(Arel.sql("random()")).limit(5) }

  def self.from_identifier(identifier)
    scope = identifier.include?("@") ? "email" : "username"
    self.send("from_#{scope}", identifier)
  end
end
