class ShareService
  attr_accessor :user_id, :friend_id, :recipe_id

  def initialize(params)
    @user_id = params[:user_id]
    @friend_id = params[:friend_id]
    @recipe_id = params[:recipe_id]
    @errors = {}
  end

  def self.create_and_send(params)
    share = self.create(params)
    share.transmit
  end

  def self.create(params)
    self.new(params).tap {|s| Share.create(s.instance_values)}
  end

  def transmit
    m = MessageService.create_and_send("share", transmit_params)
  end

  def transmit_params
    {
      sender_id: self.user_id,
      recipient_id: self.friend_id,
      recipe_id: self.recipe_id
    }
  end
end
